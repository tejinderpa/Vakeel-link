from fastapi import APIRouter, Depends, Query, HTTPException, Path
from typing import Optional
from app.core.supabase_client import supabase
from app.api.dependencies import get_current_user, require_role

router = APIRouter()


DOMAIN_ALIASES = {
    "criminal law": "criminal",
    "criminal": "criminal",
    "labour law": "labour",
    "labor law": "labour",
    "labour": "labour",
    "family law": "family",
    "family": "family",
    "property law": "property",
    "property": "property",
    "consumer law": "consumer",
    "consumer": "consumer",
    "constitutional law": "constitutional",
    "constitutional": "constitutional",
}

@router.get("/")
def get_lawyers(
    domain: Optional[str] = Query(None, description="Filter by RAG domain / specialization"),
    location: Optional[str] = Query(None, description="Filter by location (ilike match)"),
    sort_by: Optional[str] = Query("ranked", description="Sort by 'ranked', 'rating', 'experience', or 'cases_solved'"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Search and filter verified lawyers. Public route.
    Returns a paginated array of lawyer cards.
    """
    client = supabase.get_client()
    query = client.table("lawyers").select("*", count="exact")

    if domain:
        normalized_domain = DOMAIN_ALIASES.get(domain.strip().lower(), domain.strip().lower())
        query = query.eq("specialization", normalized_domain)
    if location:
        query = query.ilike("location", f"%{location}%")

    try:
        response = query.execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    lawyers = response.data or []
    lawyer_ids = [str(item.get("id")) for item in lawyers if item.get("id")]

    completed_counts = {}
    if lawyer_ids:
        try:
            consultations = (
                client.table("consultations")
                .select("lawyer_id, status")
                .in_("lawyer_id", lawyer_ids)
                .execute()
            )
            for row in consultations.data or []:
                if row.get("status") != "completed":
                    continue
                lid = str(row.get("lawyer_id"))
                completed_counts[lid] = completed_counts.get(lid, 0) + 1
        except Exception:
            # Keep counts as 0 if consultations table is unavailable.
            completed_counts = {}

    for item in lawyers:
        lawyer_id = str(item.get("id"))
        cases_solved = int(completed_counts.get(lawyer_id, 0))
        item["cases_solved"] = cases_solved
        item["avatar"] = item.get("avatar") or item.get("profile_image_url")
        if "is_online" in item:
            item["available"] = "online" if item["is_online"] else "offline"

    sort_key = (sort_by or "ranked").lower()
    if sort_key == "rating":
        lawyers.sort(key=lambda x: float(x.get("rating") or 0), reverse=True)
    elif sort_key == "experience":
        lawyers.sort(key=lambda x: int(x.get("experience_years") or 0), reverse=True)
    elif sort_key == "cases_solved":
        lawyers.sort(key=lambda x: int(x.get("cases_solved") or 0), reverse=True)
    else:
        # Ranked blend requested by product: cases solved first, then experience, then rating.
        lawyers.sort(
            key=lambda x: (
                int(x.get("cases_solved") or 0),
                int(x.get("experience_years") or 0),
                float(x.get("rating") or 0),
            ),
            reverse=True,
        )

    offset = (page - 1) * limit
    paged_lawyers = lawyers[offset:offset + limit]

    return {
        "data": paged_lawyers,
        "total_count": response.count if hasattr(response, "count") and response.count is not None else len(lawyers),
        "page": page,
        "limit": limit,
        "sort_by": sort_key,
    }

@router.get("/{lawyer_id}")
def get_lawyer_profile(
    lawyer_id: str = Path(..., description="The ID of the lawyer")
):
    """
    Get the full lawyer profile including bio, areas_of_practice, latest 10 reviews,
    and availability schedule grouped by day.
    """
    client = supabase.get_client()
    
    try:
        # We fetch lawyer data, along with reviews and availability in a single query
        # We rely on Supabase PostgREST for the joins.
        response = client.table("lawyers").select(
            "*, lawyer_reviews(*), lawyer_availability(*)"
        ).eq("id", lawyer_id).execute()
        
        data = response.data
        if not data:
            raise HTTPException(status_code=404, detail="Lawyer not found")
        
        lawyer_data = data[0]
        
        # Process reviews: sort by created_at descending and take top 10
        reviews = lawyer_data.get("lawyer_reviews", [])
        reviews.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        lawyer_data["lawyer_reviews"] = reviews[:10]
        
        # Process availability: group by day_of_week
        availability = lawyer_data.get("lawyer_availability", [])
        grouped_availability = {}
        for slot in availability:
            day = slot.get("day_of_week")
            if day not in grouped_availability:
                grouped_availability[day] = []
            grouped_availability[day].append({
                "id": slot.get("id"),
                "start_time": slot.get("start_time"),
                "end_time": slot.get("end_time")
            })
            
        lawyer_data["grouped_availability"] = grouped_availability
        
        # Remove the raw lawyer_availability array
        lawyer_data.pop("lawyer_availability", None)
        
        if "is_online" in lawyer_data:
            lawyer_data["available"] = "online" if lawyer_data["is_online"] else "offline"
            
        return lawyer_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me/profile")
def get_my_lawyer_profile(user = Depends(get_current_user)):
    """
    Get the logged-in lawyer's private profile.
    """
    # Assuming `get_current_user` logic exists in dependencies.
    client = supabase.get_client()
    response = client.table("lawyers").select("*").eq("id", user.id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return response.data[0]
