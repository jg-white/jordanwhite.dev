# main.tf

# -----------------------
# ECR: Container Registry
# -----------------------
resource "aws_ecr_repository" "daily_devops" {
  name = "daily-devops"
}

# -----------------------
# Security Group
# -----------------------
resource "aws_security_group" "AllowIn" {
  name        = "AllowIn"
  description = "Allow Internet traffic to reach ec2"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -----------------------
# Elastic IP
# -----------------------
resource "aws_eip" "ec2_eip" {
  vpc = true
}

# -----------------------
# EC2 Instance
# -----------------------
resource "aws_instance" "daily_devops_ec2" {
  ami                         = data.aws_ami.amazon_linux.id # Amazon Linux 2
  instance_type               = "t3.micro"
  key_name                    = "desktop"
  vpc_security_group_ids      = [aws_security_group.AllowIn.id]
  associate_public_ip_address = true

  # Optional: User data to install Docker
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install docker -y
              service docker start
              usermod -a -G docker ec2-user
              EOF

  tags = {
    Name = "daily-devops-ec2"
  }
}

# Associate Elastic IP with EC2
resource "aws_eip_association" "ec2_eip_assoc" {
  instance_id   = aws_instance.daily_devops_ec2.id
  allocation_id = aws_eip.ec2_eip.id
}


# -----------------------
# Data: Default VPC & AMI
# -----------------------
data "aws_vpc" "default" {
  default = true
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.8.20250808.1-kernel-6.1-x86_64"]
  }
}
