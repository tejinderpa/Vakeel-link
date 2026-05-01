from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_user
from app.core.supabase_client import supabase

router = APIRouter()


@router.get("/mine")
def get_my_consultations(current_user=Depends(get_current_user)):
    """
    Return consultations where current user is either client or lawyer.
    """
    client = supabase.get_client()
    try:
        response = (
            client.table("consultations")
            .select("*")
            .or_(f"user_id.eq.{current_user.id},lawyer_id.eq.{current_user.id}")
            .order("scheduled_at", desc=False)
            .execute()
        )
        return {"data": response.data or []}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load consultations: {exc}")
