output "api_url" {
  value = google_cloud_run_service.api.status[0].url
}

output "frotend_url" {
  value = google_cloud_run_service.frontend.status[0].url
}

output "frontend_ip" {
  value = google_compute_global_address.frontend_ip.address
}