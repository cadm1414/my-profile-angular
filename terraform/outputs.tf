output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.frontend.id
}

output "s3_bucket_website_endpoint" {
  description = "Website endpoint for the S3 bucket"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "website_url" {
  description = "Full website URL (HTTP only)"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}
