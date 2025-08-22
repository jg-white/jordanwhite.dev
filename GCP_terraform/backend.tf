# Pull State files
terraform {
  backend "gcs" {
    bucket = "jordanwhitedev-tf-state"
    prefix = "terraform/state"
  }
}