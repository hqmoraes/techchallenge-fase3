# kubernetes-infra/terraform/alarms.tf
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "lambda-auth-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Alarme para erros na função Lambda de autenticação"
  
  dimensions = {
    FunctionName = "fastfood-auth"
  }
  
  alarm_actions     = [aws_sns_topic.alarm_topic.arn]
  ok_actions        = [aws_sns_topic.alarm_topic.arn]
}

resource "aws_sns_topic" "alarm_topic" {
  name = "fastfood-alerts"
}