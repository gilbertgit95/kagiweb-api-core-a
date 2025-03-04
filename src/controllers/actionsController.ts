class ActionsController {
    public async acceptAccountInvitation(forAccountId:string, toAccountId:string, refId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check if the invitation was sent

        // update the accoumt reference so that accepeted field is true and decliend remains false
        return true
    }

    public async declineAccountInvitation(forAccountId:string, toAccountId:string, refId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check if the invitation was sent

        // update the accoumt reference so that declined field is true and accepted remains false
        return true
    }

    public async acceptAccountWorkspaceInvitation(forAccountId:string, toAccountId:string, toWorkspaceId:string, refId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check workspace is existing

        // check if the invitation was sent

        // update the accoumt reference so that decliend field is true and accepted remains false
        return true
    }

    public async declineAccountWorkspaceInvitation(forAccountId:string, toAccountId:string, toWorkspaceId:string, refId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check workspace is existing

        // check if the invitation was sent

        // update the accoumt reference so that declined field is true and accepted remains false
        return true
    }
}

export default new ActionsController()