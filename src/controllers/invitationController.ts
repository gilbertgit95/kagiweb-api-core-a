class InvitationController {
    public async acceptAccountInvitation(accountId:string, toAccountId:string):Promise<boolean> {
        return true
    }

    public async declineAccountInvitation(accountId:string, toAccountId:string):Promise<boolean> {
        return true
    }

    public async acceptAccountWorkspaceInvitation(accountId:string, toAccountId:string, toWorkspaceId:string):Promise<boolean> {
        return true
    }

    public async declineAccountWorkspaceInvitation(accountId:string, toAccountId:string, toWorkspaceId:string):Promise<boolean> {
        return true
    }
}

export default new InvitationController()