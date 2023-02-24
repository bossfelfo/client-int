const apiUrl = 'http://substantiveresearch.pythonanywhere.com/';

const apiUrlENV = process.env.REACT_APP_API_URL || process.env.API_URL;

const url = apiUrl || apiUrlENV;

const getClientInteractions = async () => {
  const result = await fetch(url!).then((res) => res.json());

  return { result };
};

export { getClientInteractions };
