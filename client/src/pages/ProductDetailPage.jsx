import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail, fetchProducts, addReviewAction } from '../redux/slices/productSlice';
import { addItemToCart } from '../redux/slices/cartSlice';
import useWindowSize from '../hooks/useWindowSize';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

function ProductDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, products, loading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const { width } = useWindowSize();
    const isMobile = width < 768;
    const { toast, showToast, hideToast } = useToast();

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('rating & reviews');
    const [selectedImage, setSelectedImage] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({ name: '', rating: 5, comment: '' });

    useEffect(() => {
        dispatch(fetchProductDetail(id));
        dispatch(fetchProducts());
    }, [id, dispatch]);

    const handleAddToCart = async () => {
        if (!user) {
            showToast('Please login to add items to cart!', 'warning');
            return;
        }
        if (!selectedSize) {
            showToast('Please select a size!', 'warning');
            return;
        }
        const variant = product.variants?.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );
        await dispatch(addItemToCart({
            product_id: product.id,
            variant_id: variant?.id,
            quantity,
        }));
        showToast('Added to cart successfully!', 'success');
    };

    const handleSubmitReview = async () => {
        if (!reviewData.name || !reviewData.comment) {
            showToast('Please fill in all fields!', 'warning');
            return;
        }
        try {
            await dispatch(addReviewAction({ id: product.id, data: reviewData }));
            setReviewData({ name: '', rating: 5, comment: '' });
            setShowReviewForm(false);
            dispatch(fetchProductDetail(id));
            showToast('Review submitted successfully!', 'success');
        } catch (error) {
            showToast('Something went wrong!', 'error');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>;
    if (!product) return <p style={{ textAlign: 'center', padding: '40px' }}>Product not found!</p>;

    const uniqueColors = [...new Set(product.variants?.map((v) => v.color) || [])];
    const uniqueSizes = [...new Set(product.variants?.map((v) => v.size) || [])];

    const similarProducts = products.filter((p) =>
        p.id !== product.id &&
        p.category?.id === product.category?.id
    ).slice(0, 4);

    return (
        <div style={{ padding: isMobile ? '16px' : '24px 40px' }}>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            {/* Breadcrumb */}
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '16px' }}>
                Home › Shop › {product.category?.name} › {product.name}
            </p>

            {/* Product Section */}
            <div style={{
                display: 'flex',
                gap: isMobile ? '0' : '40px',
                marginBottom: '48px',
                flexDirection: isMobile ? 'column' : 'row'
            }}>

                {/* Left - Images */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexDirection: isMobile ? 'column' : 'row',
                    marginBottom: isMobile ? '24px' : '0'
                }}>
                    {/* Mobile - Main Image on top */}
                    {isMobile && (
                        <div style={{
                            width: '100%', height: '300px',
                            backgroundColor: '#f2f0f1', borderRadius: '16px', overflow: 'hidden'
                        }}>
                            {product.image ? (
                                <img src={product.image} alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>No Image</div>}
                        </div>
                    )}

                    {/* Thumbnails */}
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        gap: '12px'
                    }}>
                        {[0, 1, 2].map((i) => (
                            <div key={i} onClick={() => setSelectedImage(i)} style={{
                                width: '80px', height: '80px',
                                backgroundColor: '#f2f0f1', borderRadius: '8px',
                                cursor: 'pointer',
                                border: selectedImage === i ? '2px solid #000' : '2px solid transparent',
                                overflow: 'hidden', flexShrink: 0
                            }}>
                                {product.image ? (
                                    <img src={product.image} alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '12px' }}>No</div>}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Main Image */}
                    {!isMobile && (
                        <div style={{
                            width: '380px', height: '450px',
                            backgroundColor: '#f2f0f1', borderRadius: '16px', overflow: 'hidden'
                        }}>
                            {product.image ? (
                                <img src={product.image} alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>No Image</div>}
                        </div>
                    )}
                </div>

                {/* Right - Details */}
                <div style={{ flex: 1 }}>
                    <h1 style={{
                        fontSize: isMobile ? '22px' : '32px',
                        fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px'
                    }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ color: '#FFC633', fontSize: '16px' }}>
                            {'★'.repeat(Math.floor(product.rating))}
                        </span>
                        <span style={{ color: '#666', fontSize: '13px' }}>{product.rating}/5</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700' }}>${product.price}</span>
                        {product.discount > 0 && (
                            <>
                                <span style={{ color: '#999', textDecoration: 'line-through', fontSize: isMobile ? '16px' : '20px' }}>
                                    ${product.original_price}
                                </span>
                                <span style={{
                                    backgroundColor: '#ffe5e5', color: '#ff3333',
                                    padding: '4px 12px', borderRadius: '50px',
                                    fontSize: '13px', fontWeight: '600'
                                }}>-{product.discount}%</span>
                            </>
                        )}
                    </div>

                    <p style={{
                        color: '#666', fontSize: '14px', lineHeight: '1.6',
                        marginBottom: '16px', borderBottom: '1px solid #e5e5e5', paddingBottom: '16px'
                    }}>
                        {product.description}
                    </p>

                    {/* Colors */}
                    {uniqueColors.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>Select Colors</p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {uniqueColors.map((color) => (
                                    <div key={color} onClick={() => setSelectedColor(color)} style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        backgroundColor: color, cursor: 'pointer',
                                        border: selectedColor === color ? '3px solid #000' : '2px solid #e5e5e5',
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {uniqueSizes.length > 0 && (
                        <div style={{ marginBottom: '16px', borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
                            <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>Choose Size</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {uniqueSizes.map((size) => (
                                    <button key={size} onClick={() => setSelectedSize(size)} style={{
                                        padding: isMobile ? '6px 14px' : '8px 20px',
                                        borderRadius: '50px', border: '1px solid #e5e5e5',
                                        backgroundColor: selectedSize === size ? '#000' : '#f0f0f0',
                                        color: selectedSize === size ? '#fff' : '#000',
                                        cursor: 'pointer', fontSize: '13px'
                                    }}>{size}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Add to Cart */}
                    <div style={{
                        display: 'flex', gap: '12px', alignItems: 'center',
                        borderTop: '1px solid #e5e5e5', paddingTop: '16px',
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            backgroundColor: '#f0f0f0', borderRadius: '50px',
                            padding: isMobile ? '8px 16px' : '8px 20px'
                        }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>−</button>
                            <span style={{ fontSize: '16px', fontWeight: '600' }}>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>+</button>
                        </div>
                        <button onClick={handleAddToCart} style={{
                            flex: 1, backgroundColor: '#000', color: '#fff',
                            border: 'none', borderRadius: '50px',
                            padding: isMobile ? '12px' : '16px',
                            fontSize: isMobile ? '14px' : '16px',
                            fontWeight: '600', cursor: 'pointer'
                        }}>Add to Cart</button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                borderBottom: '1px solid #e5e5e5', marginBottom: '32px',
                overflowX: isMobile ? 'auto' : 'visible',
                whiteSpace: isMobile ? 'nowrap' : 'normal'
            }}>
                {['Product Details', 'Rating & Reviews', 'FAQs'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{
                        background: 'none', border: 'none',
                        padding: isMobile ? '12px 16px' : '16px 32px',
                        fontSize: isMobile ? '14px' : '16px',
                        cursor: 'pointer',
                        color: activeTab === tab.toLowerCase() ? '#000' : '#666',
                        borderBottom: activeTab === tab.toLowerCase() ? '2px solid #000' : 'none',
                        fontWeight: activeTab === tab.toLowerCase() ? '600' : '400'
                    }}>{tab}</button>
                ))}
            </div>

            {/* Product Details Tab */}
            {activeTab === 'product details' && (
                <div style={{ maxWidth: '600px' }}>
                    <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Product Details</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        {[
                            { label: 'Category', value: product.category?.name },
                            { label: 'Dress Style', value: product.dress_style?.name },
                            { label: 'Rating', value: `${product.rating}/5` },
                            { label: 'Available Sizes', value: [...new Set(product.variants?.map(v => v.size))].join(', ') },
                            { label: 'Available Colors', value: [...new Set(product.variants?.map(v => v.color))].join(', ') },
                        ].map((item) => (
                            <tr key={item.label} style={{ borderBottom: '1px solid #e5e5e5' }}>
                                <td style={{ padding: '12px 0', color: '#666', width: '150px', fontSize: isMobile ? '13px' : '14px' }}>{item.label}</td>
                                <td style={{ padding: '12px 0', fontWeight: '600', fontSize: isMobile ? '13px' : '14px' }}>{item.value}</td>
                            </tr>
                        ))}
                    </table>
                </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'rating & reviews' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700' }}>
                            All Reviews ({product.reviews?.length || 0})
                        </h3>
                        <button onClick={() => setShowReviewForm(!showReviewForm)} style={{
                            backgroundColor: '#000', color: '#fff', border: 'none',
                            borderRadius: '50px', padding: isMobile ? '8px 16px' : '10px 24px',
                            cursor: 'pointer', fontSize: isMobile ? '12px' : '14px'
                        }}>
                            {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                    </div>

                    {showReviewForm && (
                        <div style={{ border: '1px solid #e5e5e5', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Write Your Review</h4>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Your Name</label>
                                <input type="text" value={reviewData.name}
                                    onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Rating</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} onClick={() => setReviewData({ ...reviewData, rating: star })}
                                            style={{ fontSize: '24px', cursor: 'pointer', color: star <= reviewData.rating ? '#FFC633' : '#e5e5e5' }}>★</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Comment</label>
                                <textarea value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    placeholder="Write your review here..." rows={4}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={handleSubmitReview} style={{
                                backgroundColor: '#000', color: '#fff', border: 'none',
                                borderRadius: '50px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                            }}>Submit Review</button>
                        </div>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: '24px'
                    }}>
                        {product.reviews?.length > 0 ? product.reviews.map((review) => (
                            <div key={review.id} style={{ border: '1px solid #e5e5e5', borderRadius: '16px', padding: '24px' }}>
                                <div style={{ color: '#FFC633', fontSize: '16px', marginBottom: '8px' }}>
                                    {'★'.repeat(review.rating)}
                                </div>
                                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>{review.name} ✅</h4>
                                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>"{review.comment}"</p>
                                <p style={{ color: '#999', fontSize: '12px' }}>
                                    Posted on {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        )) : (
                            <p style={{ color: '#666' }}>No reviews yet! Be the first to review!</p>
                        )}
                    </div>
                </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
                <div style={{ maxWidth: '700px' }}>
                    {[
                        { question: 'What is your return policy?', answer: 'We offer a 30-day return policy. Items must be unworn, unwashed, and in original condition with tags attached.' },
                        { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.' },
                        { question: 'How do I find my size?', answer: 'Please refer to our size guide. We recommend measuring yourself and comparing to our size chart for the best fit.' },
                        { question: 'Can I exchange my order?', answer: 'Yes! You can exchange items within 30 days of purchase. Contact our customer support team to initiate an exchange.' },
                        { question: 'Is my payment information secure?', answer: 'Absolutely! We use industry-standard SSL encryption to protect your payment information.' },
                    ].map((faq, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #e5e5e5', padding: '20px 0' }}>
                            <h4 style={{ fontWeight: '700', marginBottom: '8px', fontSize: isMobile ? '14px' : '16px' }}>{faq.question}</h4>
                            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{faq.answer}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* You Might Also Like */}
            <div style={{ marginTop: '48px' }}>
                <h2 style={{
                    textAlign: 'center',
                    fontSize: isMobile ? '24px' : '36px',
                    fontWeight: '900', textTransform: 'uppercase',
                    marginBottom: '32px',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '2px'
                }}>
                    You Might Also Like
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? '12px' : '24px'
                }}>
                    {(similarProducts.length > 0 ? similarProducts : products.slice(0, 4).filter(p => p.id !== product.id)).map((p) => (
                        <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none', color: '#000' }}>
                            <div style={{
                                backgroundColor: '#f2f0f1', borderRadius: '16px', overflow: 'hidden',
                                height: isMobile ? '150px' : '200px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
                            }}>
                                {p.image ? (
                                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : <div style={{ color: '#999' }}>No Image</div>}
                            </div>
                            <h3 style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '700', marginBottom: '4px' }}>{p.name}</h3>
                            <div style={{ color: '#FFC633', fontSize: '12px', marginBottom: '4px' }}>
                                {'★'.repeat(Math.floor(p.rating))}
                                <span style={{ color: '#666', marginLeft: '4px' }}>{p.rating}/5</span>
                            </div>
                            <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700' }}>${p.price}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;