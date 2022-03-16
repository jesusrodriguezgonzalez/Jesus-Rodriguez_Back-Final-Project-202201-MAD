export const tokenError = {
    message: 'token missing or invalid',
    status: '401',
    name: 'Unauthorized',
};
export const unAuthorized = {
    message: 'Unauthorized',
    status: '401',
    name: 'Unauthorized',
};

export const createUserError = {
    message: 'The user must have email, name and password',
    status: '400',
    name: 'User creation error',
};

export const errUpdateUser = {
    message: 'The user has not been updated',
    status: '500',
    name: 'User update error',
};
