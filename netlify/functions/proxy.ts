import { Context } from "@netlify/edge-functions";

const pickHeaders = (headers: Headers, keys: (string | RegExp)[]): Headers => {
  const picked = new Headers();
  for (const key of headers.keys()) {
    if (keys.some((k) => (typeof k === "string" ? k === key : k.test(key)))) {
      const value = headers.get(key);
      if (typeof value === "string") {
        picked.set(key, value);
      }
    }
  }
  return picked;
};

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "*",
  "access-control-allow-headers": "*",
};

export default async (request: Request, context: Context) => {

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  const { pathname, searchParams } = new URL(request.url);
  if(pathname === "/") {
    let blank_html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Taha Amin Ghafuri - Google Ultra AI For Free</title>
  <meta name="robots" content="index, follow">
  <link rel="icon" type="image/ico" href="https://tahaghafuri.ir/favicon.ico">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="#">Taha Amin Ghafuri</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="https://tahaghafuri.ir/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://blog.tahaghafuri.ir/">Blog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://chat.tahaghafuri.ir/">AI ChatBot</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://ai.tahaghafuri.ir/">AI</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://www.sololearn.com/profile/22699947/">SoloLearn</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://packagist.org/users/tahaghafuri/">Packagist</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://savenet.ir/tahaghafuri">Shop</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <section class="py-5 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h1>Welcome To My AI ChatBot</h1>
          <p class="lead">Start To Chat With AI.</p>
          <a href="https://chat.tahaghafuri.ir/" class="btn btn-primary btn-lg">Learn More</a>
        </div>
        <div class="col-lg-6">
          <img src="data:image/png;base64,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" class="img-fluid" alt="Google AI">
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <img src="https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43HXCNftVJVttoo4ucl7rsMASXW3Xr6GlXURCubE1tA=w3840-h2160-rw" class="img-fluid" alt="Google Logo">
        </div>
        <div class="col-lg-6">
          <h2>About</h2>
          <p class="lead">My AI ChatBot Based On Google Ultra AI.</p>
          <p>You Can Start Chat With It For Free.</p>
          <a href="https://chat.tahaghafuri.ir" class="btn btn-secondary">Learn More</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-dark text-white py-3">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <p>&copy; 2024 Taha Amin Ghafuri. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-md-right">
          <a href="https://github.com/tahaghafuri/" class="text-white">Github</a>
          <span class="text-white mx-2">|</span>
          <a href="https://www.linkedin.com/in/tahaghafuri/" class="text-white">LinkedIn</a>
          <span class="text-white mx-2">|</span>
          <a href="https://www.youtube.com/@tahaaminghafuri" class="text-white">Youtube</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
    `
    return new Response(blank_html, {
      headers: {
        ...CORS_HEADERS,
        "content-type": "text/html"
      },
    });
  }

  const url = new URL(pathname, "https://generativelanguage.googleapis.com");
  searchParams.delete("_path");

  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const headers = pickHeaders(request.headers, ["content-type", "x-goog-api-client", "x-goog-api-key", "accept-encoding"]);

  const response = await fetch(url, {
    body: request.body,
    method: request.method,
    duplex: 'half',
    headers,
  });

  const responseHeaders = {
    ...CORS_HEADERS,
    ...Object.fromEntries(response.headers),
    "content-encoding": null
  };

  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status
  });
};
