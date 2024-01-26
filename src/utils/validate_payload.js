export const valid_create_product = (payload) => {
    const REQUIRE_FIELDS = [
        'name',
        'price',
        'category',
        'weight'
    ];

    let isMissingRequireField = false;
    REQUIRE_FIELDS.forEach((field)=> {
        if (payload[field] === undefined) {
            isMissingRequireField = true
        }
    })
    return isMissingRequireField
};

export const valid_edit_product = (payload) => {
    const ALLOW_FIELDS = [
        'name',
        'price',
        'category',
        'weight'
    ];
    let isMissingRequireField = false;

    REQUIRE_FIELDS.forEach((field)=>{
        if (payload.field === undefined) {
            isMissingRequireField = true
        }
    })

    return isMissingRequireField
};