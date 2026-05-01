from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.dependencies import get_current_user
from app.core.supabase_client import supabase

router = APIRouter()


class UserProfileUpdate(BaseModel):
    full_name: str = Field(..., min_length=1)


@router.get("/me")
def get_current_user_profile(current_user=Depends(get_current_user)):
    """
    Return profile data for the authenticated user.
    Falls back to auth user metadata if profiles row is missing.
    """
    client = supabase.get_client()
    profile_payload = {
        "id": current_user.id,
        "email": getattr(current_user, "email", None),
        "full_name": None,
    }

    try:
        response = (
            client.table("profiles")
            .select("id, full_name, role")
            .eq("id", current_user.id)
            .single()
            .execute()
        )
        if response.data:
            profile_payload.update(response.data)
    except Exception:
        # Keep serving from auth metadata fallback if profile table isn't ready.
        pass

    if not profile_payload.get("full_name"):
        user_meta = getattr(current_user, "user_metadata", {}) or {}
        profile_payload["full_name"] = (
            user_meta.get("full_name")
            or user_meta.get("name")
            or (profile_payload.get("email") or "").split("@")[0]
            or "User"
        )

    return profile_payload


@router.put("/me")
def update_current_user_profile(payload: UserProfileUpdate, current_user=Depends(get_current_user)):
    """
    Update the current user's display name in profiles table.
    """
    client = supabase.get_client()
    try:
        response = (
            client.table("profiles")
            .upsert(
                {
                    "id": current_user.id,
                    "full_name": payload.full_name.strip(),
                    "email": getattr(current_user, "email", None),
                },
                on_conflict="id",
            )
            .execute()
        )
        saved = response.data[0] if response.data else None
        return {"ok": True, "profile": saved}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {exc}")
