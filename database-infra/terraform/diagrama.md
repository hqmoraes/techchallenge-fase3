flowchart TB
    %% Atores
    customer["Cliente"]
    admin["Administrador"]
    
    %% AWS Cloud
    subgraph aws["AWS Cloud"]
        %% EKS Cluster
        subgraph eks["EKS Cluster"]
            subgraph ns["Namespace: fastfood"]
                apigw["API Gateway<br>Express.js + Swagger"]
                orders["Serviço de Pedidos"]
                products["Serviço de Produtos"]
                payment["Serviço de Pagamento"]
                auth["Serviço de Autenticação"]
                
                %% Recursos Kubernetes
                config["ConfigMaps"]
                secrets["Secrets"]
                svcAcct["ServiceAccount"]
            end
        end
        
        %% Serviços AWS
        dynamodb["DynamoDB Tables"]
        lambda["Lambda Autenticação"]
        ecr["Amazon ECR"]
        elb["Elastic Load Balancer"]
        iam["IAM Roles & Policies"]
    end
    
    %% CI/CD
    cicd["GitHub Actions CI/CD"]
    
    %% Relações
    customer --> elb
    admin --> elb
    elb --> apigw
    apigw --> orders
    apigw --> products
    apigw --> payment
    apigw --> auth
    
    orders --> dynamodb
    products --> dynamodb
    payment --> dynamodb
    auth --> lambda
    lambda --> dynamodb
    
    orders --> svcAcct
    products --> svcAcct
    payment --> svcAcct
    auth --> svcAcct
    
    svcAcct --> iam
    eks --> ecr
    
    cicd --> ecr
    cicd --> eks
    
    %% Estilo
    classDef aws fill:#FF9900,stroke:#232F3E,color:white;
    classDef k8s fill:#326CE5,stroke:#fff,color:white;
    classDef external fill:#1E88E5,stroke:#fff,color:white;
    
    class dynamodb,lambda,ecr,elb,iam aws;
    class apigw,orders,products,payment,auth,config,secrets,svcAcct,eks,ns k8s;
    class customer,admin,cicd external;