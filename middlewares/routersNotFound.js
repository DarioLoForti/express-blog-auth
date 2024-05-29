module.exports = (req, res, next) => {
    const error = new Error('Pagina non trovata');
    res.format({
        html: () => {
            res.status(404).send('<h1>Errore 404</h1><h1>Pagina non trovata</h1><style>body{background-color: black; color: white;}</style>');
        },
        json: () => {
            res.status(404).json({error: 'Pagina non trovata'});
        }
    });
  
}