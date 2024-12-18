import { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import styled, { keyframes } from 'styled-components';

interface Calculation {
  installments: number;
  monthlyPayment: number;
  total: number;
  rate: number;
}

interface PDFDocumentProps {
  productModel: string;
  price: string;
  calculations: Calculation[];
}

interface ThemeProps {
  isDarkMode?: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const interestRates = {
  1: 8.082258064516135,
  2: 9.210000000000007,
  3: 9.931935483870964,
  4: 10.674838709677422,
  5: 11.417096774193542,
  6: 12.158064516129035,
  7: 13.02645161290323,
  8: 13.778387096774196,
  9: 14.52903225806452,
  10: 15.321935483870968,
  11: 16.049354838709684,
  12: 16.81935483870968,
  13: 18.494516129032256,
  14: 19.285806451612906,
  15: 20.074838709677424,
  16: 20.86129032258064,
  17: 21.65903225806451,
  18: 22.453548387096774,
};

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Container = styled.div<ThemeProps>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 20px;
  box-shadow: ${props => props.isDarkMode ? '0 8px 20px rgba(0, 0, 0, 0.3)' : '0 8px 20px rgba(0, 0, 0, 0.1)'};
  margin-top: 20px;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(to bottom, #1a202c 0%, #2d3748 100%)'
    : 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'};
  animation: ${fadeIn} 0.6s ease-out;
  color: ${props => props.isDarkMode ? '#fff' : 'inherit'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 10px;
    border-radius: 16px;
  }
`;

const TopBar = styled.div<ThemeProps>`
  display: flex;
  justify-content: flex-end;
  padding: 0 10px 20px 10px;

  @media (max-width: 768px) {
    padding: 0 5px 15px 5px;
  }
`;

const ThemeToggle = styled.button<ThemeProps>`
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: ${props => props.isDarkMode ? '#4a5568' : '#e2e8f0'};
  color: ${props => props.isDarkMode ? '#fff' : '#2d3748'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isDarkMode ? '#718096' : '#cbd5e0'};
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: var(--primary-gradient);
    border-radius: 2px;
  }
`;

const LogoContainer = styled.div<ThemeProps>`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${props => props.isDarkMode 
    ? 'rgba(45, 55, 72, 0.8)'
    : 'rgba(255, 255, 255, 0.8)'};
  box-shadow: ${props => props.isDarkMode 
    ? 'var(--shadow-dark-sm)'
    : 'var(--shadow-sm)'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const LogoIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  text-shadow: 0 2px 10px rgba(66, 153, 225, 0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandName = styled.span<ThemeProps>`
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--font-display);
  color: ${props => props.isDarkMode ? 'var(--dark-text-primary)' : 'var(--text-primary)'};
  letter-spacing: -0.5px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Tagline = styled.span<ThemeProps>`
  font-size: 0.9rem;
  color: ${props => props.isDarkMode ? 'var(--dark-text-secondary)' : 'var(--text-secondary)'};
  font-weight: 500;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
`;

const Form = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0 auto 40px auto;
  padding: 24px;
  background: ${props => props.isDarkMode 
    ? 'rgba(26, 32, 44, 0.8)'
    : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid ${props => props.isDarkMode ? 'rgba(74, 85, 104, 0.8)' : 'rgba(226, 232, 240, 0.8)'};
  max-width: 500px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 20px;
    margin-bottom: 30px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label<ThemeProps>`
  font-size: 0.95rem;
  color: ${props => props.isDarkMode ? 'var(--dark-text-secondary)' : 'var(--text-secondary)'};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background: ${props => props.isDarkMode ? 'var(--dark-primary)' : 'var(--primary-color)'};
    border-radius: 50%;
  }
`;

const Input = styled.input<ThemeProps>`
  padding: 14px 16px;
  border: 2px solid ${props => props.isDarkMode ? '#4a5568' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s;
  background: ${props => props.isDarkMode ? '#2d3748' : 'white'};
  color: ${props => props.isDarkMode ? '#fff' : 'inherit'};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.isDarkMode ? '#718096' : '#a0aec0'};
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
  }
`;

const ResultsTable = styled.table<ThemeProps>`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 30px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background: ${props => props.isDarkMode ? '#2d3748' : 'white'};
  transition: all 0.3s ease;

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#4a5568' : '#e2e8f0'};
  }

  th {
    background: var(--primary-gradient);
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 20px;
    
    thead {
      display: none;
    }
    
    tbody {
      display: block;
    }
    
    tr {
      display: grid;
      grid-template-columns: 1fr;
      padding: 16px;
      border-bottom: 1px solid ${props => props.isDarkMode ? '#4a5568' : '#e2e8f0'};
      background: ${props => props.isDarkMode ? '#2d3748' : 'white'};
    }
    
    tr:nth-child(even) {
      background: ${props => props.isDarkMode ? '#283141' : '#f8fafc'};
    }
    
    tr:last-child {
      border-bottom: none;
    }
    
    td {
      padding: 12px 8px;
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }
    
    td::before {
      content: attr(data-label);
      font-weight: 600;
      font-size: 0.85rem;
      color: ${props => props.isDarkMode ? '#90cdf4' : '#4299e1'};
    }
  }
`;

const Button = styled.button`
  padding: 16px 28px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.2);
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(66, 153, 225, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 0.95rem;
  }
`;

const PDFButton = styled(Button)`
  margin: 30px auto 0 auto;
  display: block;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  box-shadow: 0 4px 6px rgba(72, 187, 120, 0.2);
  
  &:hover {
    box-shadow: 0 6px 8px rgba(72, 187, 120, 0.3);
  }
`;

const styles = StyleSheet.create({
  page: {
    padding: 25,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 40,
    color: '#f0f5fa',
    opacity: 0.15,
  },
  header: {
    marginBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    fontSize: 20,
    color: '#4299e1',
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 7,
    color: '#718096',
    textAlign: 'right',
  },
  title: {
    fontSize: 16,
    color: '#2d3748',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 8,
    color: '#718096',
    textAlign: 'center',
    marginTop: 2,
  },
  infoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 8,
    color: '#4a5568',
    width: 60,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 8,
    color: '#2d3748',
    flex: 1,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4299e1',
    padding: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    padding: 4,
    backgroundColor: '#ffffff',
    minHeight: 16,
  },
  tableRowEven: {
    backgroundColor: '#f7fafc',
  },
  tableCell: {
    flex: 1,
    fontSize: 7,
    color: '#4a5568',
    textAlign: 'center',
    padding: 2,
  },
  headerCell: {
    flex: 1,
    fontSize: 7,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 25,
    right: 25,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  footerText: {
    color: '#a0aec0',
    fontSize: 7,
    textAlign: 'center',
    marginBottom: 2,
  },
  footerLegal: {
    color: '#cbd5e0',
    fontSize: 6,
    textAlign: 'center',
    marginTop: 2,
  }
});

const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const PDFDocument: React.FC<PDFDocumentProps> = ({ productModel, price, calculations }) => {
  const currentDate = new Date();
  const totalValue = parseFloat(price);
  const totalWithMaxInstallment = calculations[calculations.length - 1].total;
  const totalInterest = totalWithMaxInstallment - totalValue;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>ALFA PRIME</Text>
        
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.logo}>α</Text>
            <Text style={styles.dateTime}>{formatDateTime(currentDate)}</Text>
          </View>
          <Text style={styles.title}>Simulação de Pagamento</Text>
          <Text style={styles.subtitle}>Relatório detalhado de parcelamento</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Produto:</Text>
            <Text style={styles.infoValue}>{productModel}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor à Vista:</Text>
            <Text style={styles.infoValue}>{formatCurrency(totalValue)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Máx. Parcelas:</Text>
            <Text style={styles.infoValue}>18x de {formatCurrency(calculations[calculations.length - 1].monthlyPayment)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Juros Total:</Text>
            <Text style={styles.infoValue}>{formatCurrency(totalInterest)} ({((totalInterest/totalValue) * 100).toFixed(2)}%)</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Parcelas</Text>
            <Text style={styles.headerCell}>Valor Mensal</Text>
            <Text style={styles.headerCell}>Total</Text>
            <Text style={styles.headerCell}>Taxa</Text>
          </View>
          {calculations.map((calc, index) => (
            <View key={index} style={{
              ...styles.tableRow,
              ...(index % 2 === 0 ? styles.tableRowEven : {})
            }}>
              <Text style={styles.tableCell}>{calc.installments}x</Text>
              <Text style={styles.tableCell}>{formatCurrency(calc.monthlyPayment)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(calc.total)}</Text>
              <Text style={styles.tableCell}>{calc.rate.toFixed(2)}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Simulação gerada por Alfa Prime em {formatDateTime(currentDate)}
          </Text>
          <Text style={styles.footerLegal}>
            Este documento é apenas uma simulação e não representa um contrato de venda.{'\n'}
            Valores e condições sujeitos a alteração sem aviso prévio.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const Toast = styled.div<{ type: 'success' | 'error' }>`
  padding: 16px 24px;
  border-radius: 12px;
  background: ${props => props.type === 'success' ? 'var(--success-gradient)' : 'linear-gradient(135deg, #f56565 0%, #c53030 100%)'};
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease-out;
  margin-top: 12px;
`;

const ErrorMessage = styled.span<ThemeProps>`
  color: ${props => props.isDarkMode ? '#fc8181' : '#f56565'};
  font-size: 0.85rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '⚠️';
    font-size: 0.9rem;
  }
`;

function App() {
  const [productModel, setProductModel] = useState('');
  const [price, setPrice] = useState('');
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{product?: string; price?: string}>({});
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      document.body.setAttribute('data-theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const newErrors: {product?: string; price?: string} = {};
    
    if (!productModel.trim()) {
      newErrors.product = 'Por favor, insira o modelo do produto';
    }
    
    const priceValue = parseFloat(price);
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Por favor, insira um preço válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateInstallments = async () => {
    if (!validateForm()) {
      showToast('Por favor, corrija os erros no formulário', 'error');
      return;
    }

    const priceValue = parseFloat(price);
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const newCalculations = Object.entries(interestRates).map(([installments, rate]) => {
        const monthlyInterest = rate / 100;
        const total = priceValue * (1 + monthlyInterest);
        const monthlyPayment = total / parseInt(installments);

        return {
          installments: parseInt(installments),
          monthlyPayment,
          total,
          rate,
        };
      });

      setCalculations(newCalculations);
      showToast('Cálculo realizado com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao realizar o cálculo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      if (errors.price) {
        setErrors(prev => ({ ...prev, price: undefined }));
      }
    }
  };

  const formatValue = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      {toast && (
        <ToastContainer>
          <Toast type={toast.type}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </Toast>
        </ToastContainer>
      )}
      
      <Container isDarkMode={isDarkMode}>
        <TopBar isDarkMode={isDarkMode}>
          <ThemeToggle isDarkMode={isDarkMode} onClick={toggleTheme}>
            {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </ThemeToggle>
        </TopBar>

        <Header>
          <LogoContainer isDarkMode={isDarkMode}>
            <LogoIcon>α</LogoIcon>
            <LogoText>
              <BrandName isDarkMode={isDarkMode}>Alfa Prime</BrandName>
              <Tagline isDarkMode={isDarkMode}>Simulador de Pagamentos</Tagline>
            </LogoText>
          </LogoContainer>
        </Header>
        
        <Form isDarkMode={isDarkMode}>
          <InputGroup>
            <Label isDarkMode={isDarkMode}>Modelo do Produto</Label>
            <Input
              type="text"
              placeholder="Ex: iPhone 13 Pro"
              value={productModel}
              onChange={(e) => {
                setProductModel(e.target.value);
                if (errors.product) {
                  setErrors(prev => ({ ...prev, product: undefined }));
                }
              }}
              isDarkMode={isDarkMode}
            />
            {errors.product && <ErrorMessage isDarkMode={isDarkMode}>{errors.product}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <Label isDarkMode={isDarkMode}>Preço</Label>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Ex: 5000"
              value={price}
              onChange={handlePriceChange}
              isDarkMode={isDarkMode}
            />
            {errors.price && <ErrorMessage isDarkMode={isDarkMode}>{errors.price}</ErrorMessage>}
          </InputGroup>
          <Button onClick={calculateInstallments}>
            Calcular Parcelas
          </Button>
        </Form>

        {calculations.length > 0 && (
          <>
            <ResultsTable isDarkMode={isDarkMode}>
              <thead>
                <tr>
                  <th>Parcelas</th>
                  <th>Valor Mensal</th>
                  <th>Total</th>
                  <th>Taxa</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((calc, index) => (
                  <tr key={index}>
                    <td data-label="Parcelas">{calc.installments}x</td>
                    <td data-label="Valor Mensal">{formatValue(calc.monthlyPayment)}</td>
                    <td data-label="Total">{formatValue(calc.total)}</td>
                    <td data-label="Taxa">{calc.rate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </ResultsTable>

            <PDFDownloadLink
              document={<PDFDocument productModel={productModel} price={price} calculations={calculations} />}
              fileName="simulacao-alfa-prime.pdf"
              style={{ textDecoration: 'none', width: '100%', marginTop: '20px' }}
            >
              {({ loading }) => (
                <PDFButton>
                  {loading ? 'Gerando PDF...' : 'Baixar Simulação em PDF'}
                </PDFButton>
              )}
            </PDFDownloadLink>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
