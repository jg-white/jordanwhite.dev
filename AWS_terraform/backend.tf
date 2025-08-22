terraform {
  backend "s3" {
    bucket         = "jordanwhitedev-tfstate"
    key            = "state/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "jordanwhitedev_tf_lockid"
  }
}
