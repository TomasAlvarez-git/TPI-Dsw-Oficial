export const isAdmin = () => {
  return localStorage.getItem('role') === 'admin';
};
