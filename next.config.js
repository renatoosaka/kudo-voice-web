const path = require('path')

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },  
  images: {
    domains: ['localhost', 'd6yngcq6k5.execute-api.us-east-1.amazonaws.com', 'd6yngcq6k5.execute-api.us-east-1.amazonaws.com/prod'],
  },
}
