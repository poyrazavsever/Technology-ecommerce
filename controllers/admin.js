const Product = require('../models/product')
const Category = require('../models/category')

exports.getProducts = (req, res, next) => {

    Product.findAll({
            attributes: ['id', 'name', 'price', 'imageUrl']
        })
        .then(products => {
            res.render('admin/products', {
                title: 'Admin Ürünler',
                products: products,
                path: '/admin/products',
                action: req.query.action
            })
        })
        .catch(err => {
            console.log(err)
        })
}


exports.getAddProducts = (req, res, next) => {
    Category.findAll()
        .then(categories => {
            res.render('admin/add-product', {
                title: 'Add Product',
                path: '/admin/add-product',
                categories: categories
            });
        })
        .catch(err => console.log(err))
    

}


exports.postAddProduct = (req, res, next) => {

    const name = req.body.name
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const categoryId = req.body.categoryId
    const user = req.user

    user.createProduct({
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        categoryId: categoryId,
    }).then(result => {
        res.redirect('/')
    }).catch(err => {
        console.log(err)
    })


}


exports.getEditProduct = (req, res, next) => {

    Product.findByPk(req.params.productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/')
            }
            Category.findAll()
                .then(categories => {
                    res.render('admin/edit-product', {
                        title: `Edit ${product.name}`,
                        path: '/admin/products',
                        product: product,
                        categories: categories
                    });
                })
                .catch(err => console.log(err))

        }).catch(err => {
            console.log(err)
        });

}


exports.postEditProduct = (req, res, next) => {

    const id = req.body.id
    const name = req.body.name
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const categoryId = req.body.categoryId

    Product.findByPk(id)
        .then(product => {
            product.name = name
            product.price = price
            product.imageUrl = imageUrl
            product.description = description
            product.categoryId = categoryId
            return product.save()
        })
        .then(result => {
            console.log('updated')
            res.redirect('/admin/products?action=edit')
        })
        .catch(err => console.log(err))

}

exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productId

    Product.destroy({
            where: {
                id: id
            }
        })
        .then(() => {
            res.redirect('/admin/products?action=delete')
        }).catch(err => console.log(err));

}