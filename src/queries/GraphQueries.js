

export function trans1() {
    const query = `
        query trans1 {
            transaction (
                where : {
                object : {
                    object_type : {
                    type : {_eq : "project"}
                    }
                }
                transaction_type : {
                    type: {_eq: "xp"}
                }
                }
            ){
                createdAt
                amount
                object {
                name
                }
            }
            }

    `

    return query
}

export function skills() {
    const query = `
        query trans2 {
            transaction(
                where: {
                    transaction_type: {
                        type: { _like: "%skill%" }
                    }

                }
            ) {
                createdAt
                amount
                transaction_type {
                type
                }

                object {
                name
                object_type {
                    type
                }
                }
            }
            }

    `
    return query
}