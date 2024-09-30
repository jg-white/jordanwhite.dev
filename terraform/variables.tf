variable "project_id" {
  description = "The ID of the GCP project."
}

variable "region" {
  description = "The region to deploy the function in. Default: London"
  default     = "europe-west2"
}
