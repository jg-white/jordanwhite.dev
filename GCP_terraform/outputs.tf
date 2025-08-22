output "url" {
  value = google_cloud_run_service.app.status[0].url
}

output "ip" {
  value = google_compute_global_address.ip.address
}