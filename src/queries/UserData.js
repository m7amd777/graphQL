
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



export function auditinfo() {
    const query = `
        query auditInfo {
            user {
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

export function allXp() {
    const query = `
        query xpAll {
            transaction (
                where: {
                transaction_type : {
                    type : {_eq: "xp"}
                }
                }
            ) {
                amount
                transaction_type {
                type
                }
                event {
                    path
                }
            }
        }
    `
    return query
}


export function level() {
    const query = `
        query level {
            transaction (
                where: {
                transaction_type : {
                    type : {_eq: "level"}
                }
                }
                limit:1
                order_by: {createdAt: desc}
            ) {
                amount
                transaction_type {
                    type
                }
            }
        }
    `
    return query
}
