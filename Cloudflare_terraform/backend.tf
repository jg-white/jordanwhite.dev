terraform {
  backend "s3" {
    bucket         = "jordanwhitedev-tfstate"
    key            = "state/cloudflare.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "jordanwhitedev_tf_lockid"
  }
}
