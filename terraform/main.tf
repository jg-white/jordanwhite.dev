# Enable necessary services
resource "google_project_service" "services" {
  project = var.project_id
  for_each = toset([
    "run.googleapis.com",
    "compute.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "dns.googleapis.com",
    "iap.googleapis.com"
  ])
  service = each.key
}

# Create a Static IP for the Load Balancer
resource "google_compute_global_address" "ip" {
  name    = "ip"
  project = var.project_id
}

# Cloud Run App
resource "google_cloud_run_service" "app" {
  name     = "daily-devops"
  location = var.region
  project  = var.project_id

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello" # Placeholder image
      }
    }
  }
}

resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_service.app.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
  project  = var.project_id
}

# Backend Service for App
resource "google_compute_backend_service" "backend" {
  name                  = "backend"
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL"
  project               = var.project_id

  backend {
    group = google_compute_region_network_endpoint_group.neg.id
  }
}

# Health Check for Backend Services
resource "google_compute_health_check" "default" {
  name    = "default-health-check"
  project = var.project_id

  http_health_check {
    port = "80"
  }
}

# Network Endpoint Group for Cloud Run
resource "google_compute_region_network_endpoint_group" "neg" {
  name                  = "neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  project               = var.project_id

  cloud_run {
    service = google_cloud_run_service.app.name
  }
}


# URL Map to route traffic to Backend Services
resource "google_compute_url_map" "url_map" {
  name    = "url-map"
  project = var.project_id

  default_service = google_compute_backend_service.backend.id
}

# Managed SSL Certificate
resource "google_compute_managed_ssl_certificate" "default" {
  name    = "managed-ssl-cert"
  project = var.project_id

  managed {
    domains = ["jordanwhite.dev"]
  }

  lifecycle {
    prevent_destroy = true
  }
}

# Target HTTPS Proxy
resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "https-proxy"
  project          = var.project_id
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

# Global Forwarding Rule for HTTPS Traffic
resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  name       = "https-forwarding-rule"
  project    = var.project_id
  target     = google_compute_target_https_proxy.https_proxy.id
  port_range = "443"
  ip_address = google_compute_global_address.ip.id
}

# Global Forwarding Rule for HTTP Traffic (to redirect to HTTPS)
resource "google_compute_global_forwarding_rule" "http_forwarding_rule" {
  name       = "http-forwarding-rule"
  project    = var.project_id
  target     = google_compute_target_https_proxy.https_proxy.id
  port_range = "80"
  ip_address = google_compute_global_address.ip.id
}
