import jwt from 'jsonwebtoken'
export const generateToken = (userid, res) => {
    const token = jwt.sign({userid: userid}, process.env.JWT_KEY,
        {expiresIn: '7d'}
    )

    res.cookie('jwt', token , {
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })

    return token;
};