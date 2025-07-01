import axios from 'axios';

export async function addToCart(productId, quantity = 1) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/cart/items`,
      {
        productId,
        quantity,
      },
      {
        withCredentials: true,
      }
    );
    console.log("🛒 상품이 장바구니에 추가됨:", response.data);
    alert("장바구니에 추가되었습니다!");
  } catch (error) {
    console.error("상품 추가 실패:", error.response?.data || error.message);
    alert("장바구니 추가에 실패했습니다.");
  }
}
