function extractPathnameSegments(path) {
  // Pertama, hapus query string dari path
  const cleanPath = path.split("?")[0]; // "/?refresh=true" menjadi "/", "/detail/123?param=value" menjadi "/detail/123"

  const splitUrl = cleanPath.split("/");

  return {
    resource: splitUrl[1] || null, // e.g., "detail", "stories", "login"
    id: splitUrl[2] || null, // e.g., "123" (untuk /detail/123)
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = "";

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  // Jika ada ID, kita ganti dengan placeholder ':id' untuk routing
  if (pathSegments.id) {
    pathname = pathname.concat("/:id");
  }

  return pathname || "/"; // Default ke root jika tidak ada segmen
}

export function getActivePathname() {
  // Mengembalikan hash URL, misalnya "#/stories?page=1" akan menjadi "/stories?page=1"
  // atau "#/" akan menjadi "/"
  return location.hash.replace("#", "") || "/";
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

// Fungsi getRoute yang digunakan oleh App.js untuk menentukan rute
export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}