output "public_ip" {
  value = aws_eip.ec2_eip.public_ip
}
