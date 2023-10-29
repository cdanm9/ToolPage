/* checksum : b72e04d626aac119947c993363b8354b */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZIVN_VENDOR_REG_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetCitySet {
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Region'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Regio : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Landx : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bezer : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'City code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Cityc : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bezei : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.BPTypeSet {
  @sap.unicode : 'false'
  @sap.label : 'Language'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Spras : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Partner Type'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bpkind : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Text40 : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.CheckNewVendorCodeSet {
  @sap.unicode : 'false'
  @sap.label : 'Lifnr'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'Lifnr'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Status'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'Status'
  Status : String(1) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.CheckUpdateReqSet {
  @sap.unicode : 'false'
  @sap.label : 'RequestNo'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'RequestNo'
  key RequestNo : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Status'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'Status'
  Status : LargeString;
  @cds.ambiguous : 'missing on condition?'
  CheckUpdateReqSet : Association to many ZIVN_VENDOR_REG_SRV.CheckUpdateReqSet on CheckUpdateReqSet.RequestNo = RequestNo;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.CheckVendorCodeSet {
  @sap.unicode : 'false'
  @sap.label : 'Lifnr'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'Lifnr'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Status'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'Status'
  Status : String(1) not null;
  @cds.ambiguous : 'missing on condition?'
  CheckNewVendorCodeSet : Association to many ZIVN_VENDOR_REG_SRV.CheckNewVendorCodeSet on CheckNewVendorCodeSet.Lifnr = Lifnr;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetAccountGrpSet {
  @sap.unicode : 'false'
  @sap.label : 'Account group'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Ktokk : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Number range'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Numkr : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'One-Time Acct'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xcpds : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Meaning'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Txt30 : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetBankDetailSet {
  @sap.unicode : 'false'
  @sap.label : 'Company Code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  key Bukrs : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'House Bank'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  key Hbkid : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Country'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  Banks : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Key'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  Bankl : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  Banka : String(60) not null;
  @sap.unicode : 'false'
  @sap.label : 'City'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  Ort01 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Swift'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  Swift : String(11) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Number'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  Bnklz : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Branch Name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  Brnch : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetCompanyCodeSet {
  @sap.unicode : 'false'
  @sap.label : 'Company Code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bukrs : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Company Name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Butxt : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'City'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ort01 : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Waers : String(5) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetCountrySet {
  @sap.unicode : 'false'
  @sap.label : 'Country/Reg.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Landx : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Nationality'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Natio : String(15) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetCountryDetailSet {
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vehicle'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Landk : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Postal code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnplz : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for postal code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prplz : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Address layout key'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Addrs : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Postal code req'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xplzs : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'PO Box pst cde'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xplpf : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Language'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Spras : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country version'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xland : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Print Country Name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xaddr : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Name format'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Nmfmt : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'City file act'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xregs : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Street postcode'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xplst : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'ISO code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Intca : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'ISO Code 3 Char'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Intca3 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'ISO Code Num. 3'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Intcn3 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'EU Country'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xegld : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Net Discount Base'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xskfn : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Net Tax Base'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xmwsn : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank account number'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnbkn : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for bank acct no.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prbkn : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank number'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnblz : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for bank number'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prblz : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Post bank acct no.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnpsk : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for pst.chck acct no.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prpsk : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank data'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xprbk : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Key'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bnkey : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Key'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnbks : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for bank key'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prbks : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Other data'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xprso : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'VAT registr.no.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Pruin : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'VAT registr.no.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Uinln : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Tax Number 1'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnst1 : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for tax code 1'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prst1 : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Tax Number 2'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnst2 : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for tax code 2'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prst2 : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Tax Number 3'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnst3 : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for tax code 3'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prst3 : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Tax Number 4'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnst4 : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for tax code 4'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prst4 : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Tax Number 5'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lnst5 : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check rule for tax code 5'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prst5 : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'National.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Landd : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Procedure'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Kalsm : String(6) not null;
  @sap.unicode : 'false'
  @sap.label : 'Altern.Country Key'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Landa : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'BoE Payment Period'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Wechf : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Short Name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lkvrz : String(7) not null;
  @sap.unicode : 'false'
  @sap.label : 'Intrastat Code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Intcn : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Decimal Format'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xdezp : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Date Format'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Datfm : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Index Cur.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Curin : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Hard Currency'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Curha : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country Crcy'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Waers : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Exch. Rate Type'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Kurst : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Chart of dep.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Afapl : String(4) not null;
  @sap.unicode : 'false'
  @sap.unit : 'Waers'
  @sap.label : 'For Posting'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Gwgwrt : Decimal(24, 3) not null;
  @sap.unicode : 'false'
  @sap.unit : 'Waers'
  @sap.label : 'NBV for Change'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Umrwrt : Decimal(24, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Ind. Post NBV'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Kzrbwb : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Capitalize AuC w/o downpayment'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xanzum : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'WTax Cer.Num.Concept'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ctnconcept : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Service taxes'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Kzsrv : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Capital Goods'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xxinve : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'GCC Country'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xgccv : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Super region'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Sureg : String(8) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetCurrencyKeySet {
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Waers : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Long Text'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ltext : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetMaterialGrpSet {
  @sap.unicode : 'false'
  @sap.label : 'Material Group'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Matkl : String(9) not null;
  @sap.unicode : 'false'
  @sap.label : 'Matl Grp Desc.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Wgbez : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetPaymentMethodSet {
  @sap.unicode : 'false'
  @sap.label : 'Country/Reg.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Pymt Meth.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Zlsch : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Text2 : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetPaymentTermSet {
  @sap.unicode : 'false'
  @sap.label : 'Payt terms'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Zterm : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  ZtermT : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetStateSet {
  @sap.unicode : 'false'
  @sap.label : 'Country/Reg.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Region'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bland : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bezei : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetSwiftCodeSet {
  @sap.unicode : 'false'
  @sap.label : 'Banks'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.semantics : 'Banks'
  key Banks : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Swift'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.semantics : 'Swift'
  key Swift : String(11) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetTelCodeSet {
  @sap.unicode : 'false'
  @sap.label : 'Country/Reg.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Tel. to'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Telefto : String(4) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetVendorsSet {
  @sap.unicode : 'false'
  @sap.label : 'Company Code'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bukrs : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vendor'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Name1 : String(35) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetGLReconAccSet {
  @sap.unicode : 'false'
  @sap.label : 'Language'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Spras : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Chart of Accts'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Ktopl : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'G/L Account'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Saknr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Long Text'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Txt50 : String(50) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetSortKeySet {
  @sap.unicode : 'false'
  @sap.label : 'Sort key'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Zuawa : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ttext : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetPurOrgSet {
  @sap.unicode : 'false'
  @sap.label : 'Purchasing Org.'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Ekorg : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ekotx : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetIncotermSet {
  @sap.unicode : 'false'
  @sap.label : 'Incoterms'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Inco1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bezei : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZIVN_VENDOR_REG_SRV.GetSchemaGrpSet {
  @sap.unicode : 'false'
  @sap.label : 'Schema Grp Supp'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Kalsk : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'true'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Kalsb : String(30) not null;
};

