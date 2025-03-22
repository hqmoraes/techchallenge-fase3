# kubernetes-infra/terraform/monitoring.tf
resource "aws_cloudwatch_dashboard" "main_dashboard" {
  dashboard_name = "fastfood-dashboard"
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric",
        width  = 12,
        height = 6,
        properties = {
          metrics = [["AWS/Lambda", "Invocations", "FunctionName", "fastfood-auth"]],
          period = 300,
          stat   = "Sum",
          region = "us-east-1",
          title  = "Lambda - Autenticações"
        }
      }
    ]
  })
}