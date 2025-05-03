package root_handler

import (
	"financo/services/shutdown"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func HandlerFunc() http.HandlerFunc {
	webapp, err := url.Parse("http://localhost:5173")
	if err != nil {
		shutdown.ExitWithErr(3, err)
	}

	// TODO: Fix Unsupported Media Type for the favicon
	proxy := httputil.NewSingleHostReverseProxy(webapp)

	return func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	}
}
