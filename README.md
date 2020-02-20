1. Command to generate the crypto-materials:
   ./fabricNetwork.sh generate

2. Command to start the network
   ./fabricNetwork.sh up

3. Command to kill the network
   ./fabricNetwork.sh down

4. Command to install and instantiate the chaincode on the network
   ./fabricNetwork.sh install

Quick Commands

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:instantiate"]}'

# Request New User

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:requestNewUser","george","george@gmail.com","987654321","1234"]}'

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:requestNewUser","mike","mike@gmail.com","7654321098","09876"]}'

# Approve New User

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.registrar:approveNewUser","george","1234"]}'

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.registrar:approveNewUser","mike","09876"]}'

# Recharge Account

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:rechargeAccount","george","1234","upg500"]}'

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:rechargeAccount","mike","09876","upg500"]}'
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:rechargeAccount","mike","09876","upg1000"]}'

# View User as Registrar

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.registrar:viewUser","george","1234"]}'

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.registrar:viewUser","mike","09876"]}'

# Request Property Regsitration

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:requestPropertyRegistration","001","1000","registered","george","1234"]}'

# Apporve Property Regsitration

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.registrar:approvePropertyRegistration","001"]}'

# View Property as Registrar

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.registrar:viewProperty","001"]}'

# Update Property

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:updateProperty","001","george","1234","onSale"]}'

# Purcahse Property

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C registrationchannel -n regnet -c '{"Args":["org.property-registration-network.regnet.contract.user:purchaseProperty","001","mike","09876"]}'
