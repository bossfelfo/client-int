const url = 'http://substantiveresearch.pythonanywhere.com/';

const apiUrl = process.env.REACT_APP_API_URL || process.env.API_URL || url;

const getClientInteractions = async () => {
  const result = await fetch(apiUrl!).then((res) => res.json());

  return { result };
};

export { getClientInteractions };
