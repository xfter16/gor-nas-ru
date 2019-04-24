const Axios =   require('axios')
const iconv  =  require('iconv-lite');
const app =     require('express')();
const url =     process.env.URL   || 'https://gorod.mos.ru/index.php?message=';
const PORT =    process.env.PORT  || 3000;

const getAddress = number => 
  Axios.request({
    url: url + number,
    method: 'GET',
    responseType: 'arraybuffer',
    responseEncoding: 'binary'
  })
  .then(res => res.data)
  .then(res => iconv.decode(res, "win1251"))
  .then(res => res.match(/title\>(.+)&/)[1])
  .then(res => {
    const str = res.match(/адресу (.+)/);
    return !!str ? str[1] : res
  })
  .then(res => {
    console.log(res);
    return res
  })

app.get('/:id', (req, res) => getAddress(req.params.id)
                                .then(rs => res.send(rs))
                                .catch(err => {
                                  console.error(err);
                                  res.status(400).send(err);
                                }))

app.listen(PORT, () => console.log('Listening PORT... ', PORT));
