import apiClient from "./axios";
import { setToken, getToken } from "./auth-storage";

export { setToken, getToken };

export async function checkAuth() {
  try {
    const res = await apiClient.get("/api/v1/auth/me");
    const data = res.data;
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (err) {
    console.error("Auth check failed", err);
    setToken(null);
    return null;
  }
}

export async function logout() {
  try {
    await apiClient.post("/api/v1/auth/signout");
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    setToken(null);
  }
}

// Booking APIs
export async function getSeats(showId?: string) {
  const res = await apiClient.get("/seats", {
    params: { showId },
  });
  return res.data;
}

export async function getShows() {
  const res = await apiClient.get("/shows");
  return res.data;
}

export async function getShow(id: string) {
  const res = await apiClient.get(`/shows/${id}`);
  return res.data;
}

export async function bookSeats(
  seatIds: number[],
  username: string,
  showId: string,
) {
  const res = await apiClient.post("/book", { seatIds, username, showId });
  return res.data;
}
