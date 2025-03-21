// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {
    address public Owner;

    constructor() public {
        Owner = msg.sender;
    }

    modifier onlyByOwner() {
        require(msg.sender == Owner, "Only contract owner can perform this action");
        _;
    }

    enum STAGE { Init, RawMaterialSupply, Manufacture, Distribution, Retail, Sold }

    uint256 public medicineCtr;
    uint256 public rmsCtr;
    uint256 public manCtr;
    uint256 public disCtr;
    uint256 public retCtr;

    struct Medicine {
        uint256 id;
        string name;
        string description;
        string compositions;
        uint256 quantity;
        uint256 RMSid;
        uint256 MANid;
        uint256 DISid;
        uint256 RETid;
        STAGE stage;
    }

    mapping(uint256 => Medicine) public MedicineStock;

    struct Supplier {
        address addr;
        uint256 id;
        string name;
        string place;
    }

    mapping(uint256 => Supplier) public RMS;
    mapping(uint256 => Supplier) public MAN;
    mapping(uint256 => Supplier) public DIS;
    mapping(uint256 => Supplier) public RET;

    mapping(address => uint256) public RMSMap;
    mapping(address => uint256) public MANMap;
    mapping(address => uint256) public DISMap;
    mapping(address => uint256) public RETMap;

    event MedicineAdded(uint256 indexed id, string name, uint256 quantity);
    event StageChanged(uint256 indexed medicineID, STAGE stage);
    event SupplierAdded(string role, uint256 indexed id, address addr, string name);

    function showStage(uint256 _medicineID) public view returns (string memory) {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        STAGE stage = MedicineStock[_medicineID].stage;
        if (stage == STAGE.Init) return "Medicine Ordered";
        if (stage == STAGE.RawMaterialSupply) return "Raw Material Supplied";
        if (stage == STAGE.Manufacture) return "Manufacturing";
        if (stage == STAGE.Distribution) return "Distribution";
        if (stage == STAGE.Retail) return "Retail";
        if (stage == STAGE.Sold) return "Medicine Sold";
        return "Unknown Stage";
    }

    function addSupplier(string memory role, mapping(uint256 => Supplier) storage supplierMap, mapping(address => uint256) storage supplierAddressMap, uint256 counter, address _address, string memory _name, string memory _place) private {
        counter++;
        supplierMap[counter] = Supplier(_address, counter, _name, _place);
        supplierAddressMap[_address] = counter;
        emit SupplierAdded(role, counter, _address, _name);
    }

    function addRMS(address _address, string memory _name, string memory _place) public onlyByOwner {
        addSupplier("RMS", RMS, RMSMap, rmsCtr, _address, _name, _place);
        rmsCtr++;
    }

    function addManufacturer(address _address, string memory _name, string memory _place) public onlyByOwner {
        addSupplier("Manufacturer", MAN, MANMap, manCtr, _address, _name, _place);
        manCtr++;
    }

    function addDistributor(address _address, string memory _name, string memory _place) public onlyByOwner {
        addSupplier("Distributor", DIS, DISMap, disCtr, _address, _name, _place);
        disCtr++;
    }

    function addRetailer(address _address, string memory _name, string memory _place) public onlyByOwner {
        addSupplier("Retailer", RET, RETMap, retCtr, _address, _name, _place);
        retCtr++;
    }

    function updateStage(uint256 _medicineID, mapping(address => uint256) storage supplierMap, STAGE currentStage, STAGE nextStage) private {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        require(supplierMap[msg.sender] > 0, "Unauthorized action");
        require(MedicineStock[_medicineID].stage == currentStage, "Invalid Stage");
        MedicineStock[_medicineID].stage = nextStage;
        emit StageChanged(_medicineID, nextStage);
    }

    function RMSsupply(uint256 _medicineID) public {
        updateStage(_medicineID, RMSMap, STAGE.Init, STAGE.RawMaterialSupply);
        MedicineStock[_medicineID].RMSid = RMSMap[msg.sender];
    }

    function Manufacturing(uint256 _medicineID) public {
        updateStage(_medicineID, MANMap, STAGE.RawMaterialSupply, STAGE.Manufacture);
        MedicineStock[_medicineID].MANid = MANMap[msg.sender];
    }

    function Distribute(uint256 _medicineID) public {
        updateStage(_medicineID, DISMap, STAGE.Manufacture, STAGE.Distribution);
        MedicineStock[_medicineID].DISid = DISMap[msg.sender];
    }

    function Retail(uint256 _medicineID) public {
        updateStage(_medicineID, RETMap, STAGE.Distribution, STAGE.Retail);
        MedicineStock[_medicineID].RETid = RETMap[msg.sender];
    }

    function sold(uint256 _medicineID) public onlyByOwner {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid medicine ID");
        require(MedicineStock[_medicineID].stage == STAGE.Retail, "Invalid Stage");
        MedicineStock[_medicineID].stage = STAGE.Sold;
        emit StageChanged(_medicineID, STAGE.Sold);
    }

    function addMedicine(string memory _name, string memory _description, string memory _composition, uint256 _quantity) public onlyByOwner {
        require(rmsCtr > 0 && manCtr > 0 && disCtr > 0 && retCtr > 0, "All supply chain roles must be registered");
        medicineCtr++;
        MedicineStock[medicineCtr] = Medicine(medicineCtr, _name, _description, _composition, _quantity, 0, 0, 0, 0, STAGE.Init);
        emit MedicineAdded(medicineCtr, _name, _quantity);
    }
}
