const BASE_URL = 'http://localhost:5000/api/roles';

// export const fetchRoles = async () => {
//   const res = await fetch(BASE_URL);
//   if (!res.ok) throw new Error('Failed to fetch roles');
//   return await res.json();
// };

export const fetchTotalCount = async () => {
  const res = await fetch(`${BASE_URL}/total`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-store' // optional: prevent 304 caching issues
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch total count');
  }
  const data = await res.json(); // should be { total: number }
  return data;
};

export async function fetchRoles(pageNumber = 1, pageSize = 10) {
  const res = await fetch(
    `http://localhost:5000/api/roles/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  if (!res.ok) throw new Error('Failed to fetch paginated roles');
  return res.json(); // { total, pageNumber, pageSize, roles }
}

export const createRole = async (role: any) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  });

  if (!res.ok) throw new Error('Failed to create role');
  return await res.json();
};

export const updateRole = async (id: string, updatedRole: any) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedRole)
  });

  if (!res.ok) throw new Error('Failed to update role');
  return await res.json();
};

export const deleteRole = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) throw new Error('Failed to delete role');
  return await res.json();
};
