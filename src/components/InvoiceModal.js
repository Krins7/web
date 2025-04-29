import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    });
    pdf.internal.scaleFactor = 1;
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice-001.pdf');
  });
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div id="invoiceCapture" style={{ background: '#fff', fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: '100vh', padding: 0, boxShadow: '0 4px 16px #0001' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center border-bottom p-4" style={{ borderColor: '#e0e0e0' }}>
              <div className="d-flex align-items-center">
                {/* Logo */}
                <div style={{ width: 48, height: 48, background: '#e3eaf3', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  {/* Placeholder logo icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#b0c4de"/><text x="16" y="21" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">🏢</text></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>{this.props.info.billFrom || 'Prime Estate'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ background: '#334766', color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 2, padding: '4px 32px', borderRadius: 4 }}>INVOICE</div>
              </div>
            </div>
            {/* Invoice Number and Date */}
            <div className="d-flex justify-content-between px-4 pt-3 pb-2" style={{ fontSize: 14 }}>
              <div>
                <div><span style={{ fontWeight: 600 }}>Invoice Number:</span> {this.props.info.invoiceNumber || '---'}</div>
                <div><span style={{ fontWeight: 600 }}>Date:</span> {this.props.info.dateOfIssue || '--/--/----'}</div>
              </div>
            </div>
            <hr className="my-0" style={{ borderColor: '#e0e0e0' }} />
            {/* Bill From / Bill To */}
            <div className="d-flex justify-content-between px-4 pt-3 pb-2" style={{ fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Bill from:</div>
                <div>{this.props.info.billFrom || 'Company Name'}</div>
                <div>{this.props.info.billFromAddress || 'Street Address, Zip Code'}</div>
                <div>{this.props.info.billFromEmail || 'Phone Number'}</div>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Bill to:</div>
                <div>{this.props.info.billTo || 'Customer Name'}</div>
                <div>{this.props.info.billToAddress || 'Street Address, Zip Code'}</div>
                <div>{this.props.info.billToEmail || 'Phone Number'}</div>
              </div>
            </div>
            <hr className="my-0" style={{ borderColor: '#e0e0e0' }} />
            {/* Item Table */}
            <div className="px-4 pt-3">
              <Table bordered responsive style={{ borderColor: '#e0e0e0', fontSize: 14, marginBottom: 0 }}>
                <thead style={{ background: '#f8f9fa', fontWeight: 700 }}>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: 90 }}>Quantity</th>
                    <th style={{ width: 110 }}>Rate</th>
                    <th style={{ width: 80 }}>Tax</th>
                    <th style={{ width: 110 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{item.description}</div>
                      </td>
                      <td>
                        {item.quantity} <div style={{ fontSize: 11, color: '#888' }}>{item.unit || ''}</div>
                      </td>
                      <td>
                        {this.props.currency} {parseFloat(item.price).toFixed(2)}
                        <div style={{ fontSize: 11, color: '#888' }}>{item.rateUnit || ''}</div>
                      </td>
                      <td>0.00</td>
                      <td>{this.props.currency} {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {/* Terms & Totals */}
            <div className="d-flex justify-content-between px-4 pt-3 pb-2" style={{ fontSize: 14 }}>
              <div style={{ maxWidth: 320 }}>
                <div style={{ fontWeight: 600 }}>Terms & Conditions:</div>
                <div style={{ fontSize: 13, color: '#666' }}>{this.props.info.notes || 'Payment due upon receipt. Thank you for your business!'}</div>
              </div>
              <div style={{ minWidth: 220 }}>
                <div className="d-flex justify-content-between py-1">
                  <span>Subtotal:</span>
                  <span>{this.props.currency} {this.props.subTotal}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Discount:</span>
                  <span>{this.props.currency} {this.props.discountAmmount || '0.00'}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Tax:</span>
                  <span>{this.props.currency} {this.props.taxAmmount || '0.00'}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Paid:</span>
                  <span>{this.props.currency} 0.00</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2" style={{ background: '#334766', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 4, padding: '6px 16px' }}>
                  <span>Total</span>
                  <span>{this.props.currency} {this.props.total}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={GenerateInvoice}>
                  <BiPaperPlane style={{width: '15px', height: '15px', marginTop: '-3px'}} className="me-2"/>Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                  <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3"/>
      </div>
    );
  }
}

export default InvoiceModal;
