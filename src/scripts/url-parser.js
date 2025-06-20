function extractPathnameSegments(path) {
  const splitUrl = path.split("/"); // Memecah path berdasarkan '/'

  // Mengembalikan objek dengan resource dan id jika ada
  return {
    resource: splitUrl[1] || null, // Bagian setelah '/#' (misal: 'about', 'add')
    id: splitUrl[2] || null, // Bagian setelah '/resource/' (misal: id cerita)
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = "";

  // Membangun kembali string rute standar (misal: '/', '/about', '/add', '/detail/:id')
  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  // Jika ada ID, tambahkan '/:id' ke rute (untuk rute dinamis seperti detail)
  if (pathSegments.id) {
    pathname = pathname.concat("/:id");
  }

  // Mengembalikan rute standar atau '/' jika kosong
  return pathname || "/";
}

// Mengambil path dari hash URL saat ini (menghapus '#')
export function getActivePathname() {
  return location.hash.replace("#", "") || "/";
}

// Mendapatkan rute standar berdasarkan hash URL saat ini
export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

// Memparsing hash URL saat ini menjadi segmen (resource, id)
export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

// Mendapatkan rute standar dari pathname string
export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

// Memparsing pathname string menjadi segmen (resource, id)
export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}