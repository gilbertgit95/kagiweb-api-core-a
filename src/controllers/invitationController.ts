class InvitationController {
    public async acceptAccountInvitation(accountId:string, toAccountId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check if the invitation was sent

        // update the accoumt reference so that accepeted field is true and decliend remains false
        return true
    }

    public async declineAccountInvitation(accountId:string, toAccountId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check if the invitation was sent

        // update the accoumt reference so that declined field is true and accepted remains false
        return true
    }

    public async acceptAccountWorkspaceInvitation(accountId:string, toAccountId:string, toWorkspaceId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check workspace is existing

        // check if the invitation was sent

        // update the accoumt reference so that decliend field is true and accepted remains false
        return true
    }

    public async declineAccountWorkspaceInvitation(accountId:string, toAccountId:string, toWorkspaceId:string):Promise<boolean> {
        // get invited account data

        // get account invitation is comming from

        // check workspace is existing

        // check if the invitation was sent

        // update the accoumt reference so that declined field is true and accepted remains false
        return true
    }
}

export default new InvitationController()