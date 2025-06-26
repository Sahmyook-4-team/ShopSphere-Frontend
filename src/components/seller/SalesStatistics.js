import React, { useEffect, useState } from 'react';
import styles from './SellerPage.module.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const SalesStatistics = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState('all');
    const [selectedTimeRange, setSelectedTimeRange] = useState('yearly');
    const [selectedMetric, setSelectedMetric] = useState('sales');
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30))); // 기본값: 30일 전
    const [endDate, setEndDate] = useState(new Date()); // 기본값: 오늘
    const [isLoading, setIsLoading] = useState(false);

  // 카테고리 목록 로드
  useEffect(() => {
      const fetchCategories = async () => {
          try {
              const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
              setCategories(response.data || []);
          } catch (error) {
              console.error("카테고리 목록을 불러오는 데 실패했습니다:", error);
          }
      };
      fetchCategories();
      fetchProducts('all'); // 이거 좀 수정해야할 듯. 처음에만 실행되게
  }, []);

  // 상품 목록 로드
  const fetchProducts = async (category = selectedCategory) => {
      try {
          setProducts([]);
          let response;
          console.log(category);
          if(category === 'all'){
            response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/products`, { withCredentials: true });
          }else{
            response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/products/category/${category}`, { withCredentials: true });
          }
          console.log(response.data);
          setProducts(response.data || []);
      } catch (error) {
          console.error("상품 목록을 불러오는 데 실패했습니다:", error);
      }
  };

  // 날짜 범위로 데이터 조회
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert('시작일과 종료일을 모두 선택해주세요.');
      return;
    }
    
    if (startDate > endDate) {
      alert('시작일은 종료일보다 클 수 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 여기에 실제 API 호출 로직을 추가하세요
      // 예: const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/sales`, {
      //   params: { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] }
      // });
      // setFilteredData(response.data);
      
      // 임시로 1초 후에 로딩 종료 (실제 API 연동 시 제거)
      setTimeout(() => {
        setIsLoading(false);
        alert(`${startDate.toLocaleDateString()} ~ ${endDate.toLocaleDateString()} 기간의 데이터를 조회합니다.`);
      }, 1000);
    } catch (error) {
      console.error('데이터 조회 중 오류 발생:', error);
      alert('데이터를 불러오는 데 실패했습니다.');
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅 함수 (필요 시 사용)
  // const formatDate = (date) => {
  //   if (!date) return '';
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1).padStart(2, '0');
  //   const day = String(d.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // };
  
  return (
    <section className={styles.section}>
        <h2 className={styles.sectionTitle}>판매 통계</h2>
        <div className={styles.contentArea}>
            <p>년도별/월별/주별 판매량 데이터 및 차트가 여기에 표시됩니다.</p>
            <div className={styles.statsOptions}>
                <div className={styles.dateRangeContainer}>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                        className={styles.datePicker}
                        maxDate={new Date()}
                    />
                    <span className={styles.dateSeparator}>~</span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        maxDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className={styles.datePicker}
                    />
                </div>
                <select className={styles.selectBox}>
                    <option value="yearly">년도별</option>
                    <option value="monthly">월별</option>
                    <option value="weekly">주별</option>
                </select>
                <select className={styles.selectBox} onChange={(e) => {
                    const newCategory = e.target.value;
                    setSelectedCategory(newCategory);  // 상태 업데이트
                    fetchProducts(newCategory);        // 새로운 값 직접 전달
                }}>
                    <option key="all" value="all">전체</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select className={styles.selectBox} onChange={(e) => {setSelectedProduct(e.target.value)}}>
                    <option key="all" value="all">전체</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <select className={styles.selectBox}>
                    <option value="revenue">매출액</option>
                    <option value="sales">판매량</option>
                </select>
                <button 
                    className={`${styles.actionButton} ${styles.marginLeft10px}`}
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? '조회 중...' : '조회하기'}
                </button>
            </div>
            <div className={styles.chartPlaceholder}>
                판매량 차트 영역
            </div>
        </div>
    </section>
  );
};

export default SalesStatistics;
