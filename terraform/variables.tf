variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "my-profile"
}

variable "bucket_name" {
  description = "S3 bucket name for static website (must be globally unique)"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
