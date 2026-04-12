/**
 * Strip sensitive fields from a raw DB user row.
 *
 * @param {Record<string, any>} user - Raw row from the `users` table
 */
export const userSanitize = (user) => {
  return {
    firstName: user.first_name,
    lastName: user.last_name ?? null,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at ?? null,
  };
};
