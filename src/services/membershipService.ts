import { membershipRepository } from "../repositories/membershipRepository";

class membershipService {
  constructor(private Repository: membershipRepository) {
  }

  public async getmembershipInfo () {
    const getMembershipInfo = await this.Repository.getmembershipInfo();
    const replaceGetMembershipInfo = getMembershipInfo.map(data => {
      data.content = data.content.replace(/\\n/g, '\n');
      return data;
    })
    return replaceGetMembershipInfo;
  }

  public async thisUserMembership (userId: number) {
    return this.Repository.thisUserMembership(userId);
  }
}

export {
  membershipService
}