exports.handler = async (event, context) => {
  const name = 'Michael Stuper';
  const keyword = event.queryStringParameters.keyword;
  const response = `${name} says ${keyword}`;
  return {
    statusCode: 200,
    body: response
  };
};
