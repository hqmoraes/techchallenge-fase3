# kubernetes-infra/terraform/cloudwatch.tf
resource "aws_cloudwatch_dashboard" "fastfood_dashboard" {
  dashboard_name = "FastFood-Dashboard"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        x = 0
        y = 0
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiName", "fastfood-auth-api"],
          ]
          period = 300
          stat = "Sum"
          region = var.aws_region
          title = "API Gateway Requisições"
        }
      },
      {
        type = "metric"
        x = 0
        y = 6
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", "fastfood-auth"],
            ["AWS/Lambda", "Errors", "FunctionName", "fastfood-auth"],
            ["AWS/Lambda", "Duration", "FunctionName", "fastfood-auth"]
          ]
          period = 300
          stat = "Average"
          region = var.aws_region
          title = "Lambda Performance"
        }
      }
    ]
  })
}