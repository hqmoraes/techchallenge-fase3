# lambda/terraform/alerts.tf
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "lambda-auth-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 0
  alarm_actions       = [aws_sns_topic.alerts.arn]
  dimensions = {
    FunctionName = aws_lambda_function.auth_function.function_name
  }
}

resource "aws_sns_topic" "alerts" {
  name = "fastfood-alerts"
}