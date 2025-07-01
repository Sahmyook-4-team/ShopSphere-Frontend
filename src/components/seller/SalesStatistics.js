import React, { useEffect, useState, useRef } from 'react';
import styles from './SalesStatistics.module.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
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
    const [salesData, setSalesData] = useState(null);
    const [summary, setSummary] = useState(null);
    const chartRef = useRef(null);

    // 카테고리 목록 로드 및 초기 상품 목록 로드
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                setCategories(response.data || []);
            } catch (error) {
                console.error("카테고리 목록을 불러오는 데 실패했습니다:", error);
            }
        };

        const initializeData = async () => {
            await fetchCategories();
            await fetchProducts('all');
        };

        initializeData();
    }, []);

    // 상품 목록 로드
    const fetchProducts = async (category = selectedCategory) => {
        try {
            setProducts([]);
            let response;
            console.log(category);
            if (category === 'all') {
                response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/products`, { withCredentials: true });
            } else {
                response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/products/category/${category}`, { withCredentials: true });
            }
            console.log(response.data);
            setProducts(response.data || []);
        } catch (error) {
            console.error("상품 목록을 불러오는 데 실패했습니다:", error);
        }
    };


    const fetchSalesData = async () => {
        try {
            setIsLoading(true); // 로딩 시작

            const params = {
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                product: selectedProduct !== 'all' ? selectedProduct : undefined,
                timeRange: selectedTimeRange,
                startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
                endDate: endDate.toISOString().split('T')[0] // YYYY-MM-DD 형식
            };

            // undefined인 파라미터 제거
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value);
                }
            });

            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/sales/statistics?${queryParams.toString()}`);
            setSalesData(response.data.salesData);
            setSummary(response.data.summary);

        } catch (error) {
            console.error('판매 데이터를 불러오는 중 오류 발생:', error);
        } finally {
            setIsLoading(false); // 로딩 종료 (성공/실패 모두 처리)
        }
    };


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
                    <select className={styles.selectBox} onChange={(e) => setSelectedTimeRange(e.target.value)}>
                        <option value="yearly">년도별</option>
                        <option value="monthly">월별</option>
                        <option value="weekly">주별</option>
                        <option value="daily">일별</option>
                    </select>
                    <select className={styles.selectBox} onChange={(e) => {
                        const newCategory = e.target.value;
                        setSelectedCategory(newCategory);  // 상태 업데이트
                        setSelectedProduct('all');          // 전체로 변경
                        fetchProducts(newCategory);        // 새로운 값 직접 전달
                    }}>
                        <option key="all" value="all">전체</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select className={styles.selectBox} onChange={(e) => { setSelectedProduct(e.target.value) }}>
                        <option key="all" value="all">전체</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <select className={styles.selectBox} onChange={(e) => setSelectedMetric(e.target.value)}>
                        <option value="revenue">매출액</option>
                        <option value="sales">판매량</option>
                    </select>
                    <button
                        className={`${styles.actionButton} ${styles.marginLeft10px}`}
                        onClick={fetchSalesData}
                        disabled={isLoading}
                    >
                        {isLoading ? '조회 중...' : '조회하기'}
                    </button>
                </div>
                <div className={styles.chartContainer}>
                    {salesData && salesData.length > 0 ? (
                        <div className={styles.chartWrapper}>
                            <h3>판매 추이</h3>
                            <div className={styles.chart}>
                                {selectedMetric === 'revenue' ? (
                                    <Line 
                                        ref={chartRef}
                                        data={{
                                            labels: salesData.map(item => item.label),
                                            datasets: [
                                                {
                                                    label: '매출액 (원)',
                                                    data: salesData.map(item => item.salesAmount),
                                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                                    borderColor: 'rgb(53, 162, 235)',
                                                    borderWidth: 2,
                                                    tension: 0.1
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: '기간별 매출 추이',
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: function(value) {
                                                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                ) : (
                                    <Bar
                                        ref={chartRef}
                                        data={{
                                            labels: salesData.map(item => item.label),
                                            datasets: [
                                                {
                                                    label: '주문 건수',
                                                    data: salesData.map(item => item.orderCount),
                                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                                    borderColor: 'rgba(75, 192, 192, 1)',
                                                    borderWidth: 1,
                                                },
                                                {
                                                    label: '판매 상품 수',
                                                    data: salesData.map(item => item.productCount),
                                                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                                                    borderColor: 'rgba(255, 159, 64, 1)',
                                                    borderWidth: 1,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: '기간별 판매 현황',
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        stepSize: 1
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.noData}>조회된 데이터가 없습니다.</div>
                    )}

                    {summary && (
                        <div className={styles.summarySection}>
                            <h3>요약 정보</h3>
                            <div className={styles.summaryGrid}>
                                <div className={styles.summaryItem}>
                                    <div className={styles.summaryLabel}>총 매출액</div>
                                    <div className={styles.summaryValue}>
                                        {summary.totalSalesAmount.toLocaleString()}원
                                    </div>
                                </div>
                                <div className={styles.summaryItem}>
                                    <div className={styles.summaryLabel}>총 주문 건수</div>
                                    <div className={styles.summaryValue}>
                                        {summary.totalOrderCount.toLocaleString()}건
                                    </div>
                                </div>
                                <div className={styles.summaryItem}>
                                    <div className={styles.summaryLabel}>총 판매 상품 수</div>
                                    <div className={styles.summaryValue}>
                                        {summary.totalProductCount.toLocaleString()}개
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {summary?.salesByProduct && (
                        <div className={styles.topProducts}>
                            <h3>상위 판매 상품</h3>
                            <div className={styles.productList}>
                                {Object.entries(summary.salesByProduct)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([product, amount]) => (
                                        <div key={product} className={styles.productItem}>
                                            <span className={styles.productName}>{product}</span>
                                            <span className={styles.productAmount}>{amount.toLocaleString()}원</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SalesStatistics;
