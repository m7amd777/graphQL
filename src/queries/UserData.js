
export function userinfo() {
    const query = `
        query Shu {
            user {
                login
                auditRatio
                firstName
                lastName
                email
                auditsAssigned
                audits {
                createdAt
                endAt
                closedAt
                closureType
                group {
                    captainLogin
                    path
                }
                }
            }
        }
    `
    return query

}
