// Função Lambda para rotação de secrets do Tech Challenge Fast Food
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
    console.log("Rotação de Secret iniciada:", JSON.stringify(event, null, 2));
    
    const secretId = event.SecretId;
    const clientRequestToken = event.ClientRequestToken;
    const step = event.Step;
    
    try {
        // Determinar tipo de secret (database ou API)
        const secretMetadata = await secretsManager.describeSecret({
            SecretId: secretId
        }).promise();
        
        const secretName = secretMetadata.Name;
        const isDatabase = secretName.includes("database");
        
        console.log(`Processando secret ${secretName} (${isDatabase ? 'Database' : 'API'}), estágio: ${step}`);
        
        // Implementação dos passos de rotação
        switch (step) {
            case 'createSecret':
                // No nosso caso, não alteramos o conteúdo, apenas criamos uma nova versão
                const currentSecret = await secretsManager.getSecretValue({
                    SecretId: secretId,
                    VersionStage: 'AWSCURRENT'
                }).promise();
                
                // Criar nova versão com o mesmo conteúdo
                // Em um cenário real, você alteraria credenciais aqui
                await secretsManager.putSecretValue({
                    SecretId: secretId,
                    ClientRequestToken: clientRequestToken,
                    SecretString: currentSecret.SecretString,
                    VersionStages: ['AWSPENDING']
                }).promise();
                
                console.log(`Nova versão do secret ${secretName} criada`);
                break;
                
            case 'finishSecret':
                // Finalizar rotação (tornar PENDING em CURRENT)
                console.log(`Finalizando rotação do secret ${secretName}`);
                break;
                
            default:
                throw new Error(`Estágio de rotação desconhecido: ${step}`);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Estágio ${step} concluído com sucesso` })
        };
    } catch (error) {
        console.error('Erro na rotação de secret:', error);
        throw error;
    }
};